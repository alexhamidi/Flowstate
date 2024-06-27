const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios')

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'], // specify the allowed origin
    methods: ['GET', 'POST', 'DELETE'], // specify the allowed HTTP methods
}));

require('dotenv').config();

const PORT = process.env.PORT;

const client = new Client({
    user: process.env.USER,
    host: 'localhost',
    database: 'postgres',
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
});


client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to database', err));

// ************ Verification Middleware *************************************************************************************************************

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Unauthorized: Token expired' });
            }
            return res.status(403).json({ error: 'Unauthorized: Invalid token' });
        }
        req.userID = decoded.userID;
        next();
    });
};
 
module.exports = authenticateToken;



// Functionalities for signing in and Logging in  *******************************************************************

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists with that email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await client.query(
            'INSERT INTO users (email, password_hashed) VALUES ($1, $2) RETURNING *',
            [email, hashedPassword]
        );

        const token = jwt.sign(
            { userID: newUser.rows[0].id, random: Math.random().toString(36).substring(7) },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        
        res.status(201).json({ token });

    } catch (error) {

        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.rows[0].password_hashed);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userID: user.rows[0].id, random: Math.random().toString(36).substring(7) },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// **********************************************************************************************************************************


// API and functionalities for interfacing with the database *******************************************************************


app.get('/api/todos', authenticateToken, async(req, res) => {
    try {
        const userID = req.userID;
        const user = await client.query('SELECT * FROM users WHERE id = $1', [userID]);
        res.json(user.rows[0].todos);

    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//
app.post('/api/todos', authenticateToken, async(req, res) => {
    try {
        const {newTodo} = req.body;
        const userID = req.userID;
        const updatedUser = await client.query(
            'UPDATE users SET todos = array_append(todos, $1) WHERE id = $2 RETURNING todos',
            [newTodo, userID]
        );
        res.json(updatedUser.rows[0].todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
//
app.delete('/api/todos', authenticateToken, async (req, res) => {
    try {
        const { todo } = req.body;
        const userID = req.userID;
        const updatedUser = await client.query(
            'UPDATE users SET todos = array_remove(todos, $1) WHERE id = $2 RETURNING todos',
            [todo, userID]
        );
        res.json(updatedUser.rows[0].todos);
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/boardtodos', authenticateToken, async(req, res) => {
    try {
        const userID = req.userID;
        const todosOnBoard = await client.query(
            'SELECT * FROM todos_on_board WHERE id = $1',
            [userID]
        );
        res.json(todosOnBoard.rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/boardtodos', authenticateToken, async(req, res) => {
    try {
        const {todo, day, time} = req.body;
        const userID = req.userID;
        const updatedTodos = await client.query(
            'INSERT INTO todos_on_board (id, todo, day, time) VALUES ($1, $2, $3, $4) RETURNING *',
            [userID, todo, day, time]
        );
        res.json(updatedTodos.rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/boardtodos', authenticateToken, async (req, res) => {
    try {
        const { todo, day, time } = req.body;
        const userID = req.userID;
        const updatedTodos = await client.query(
            'DELETE FROM todos_on_board WHERE id = $1 AND todo = $2 AND day = $3 AND time = $4 RETURNING *;',
            [userID, todo, day, time]
        );
        res.json(updatedTodos.rows);
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


//**************************************************************************************************************************************


// API to get the image for the timer
app.get('/api/image', async(req, res) => {
    try {
        const response = await axios.get(`https://api.unsplash.com/photos/random/?client_id=${process.env.CLIENTID}&orientation=landscape&collections=1753518`);
        const imageUrl = response.data.urls.regular;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
