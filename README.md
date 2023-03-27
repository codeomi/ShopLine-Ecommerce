# ShopLine E-commerce Project

###### This is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to browse products, add products to a cart, and complete orders.

## Installation

1. **Clone the repository:** `git clone git@github.com:codeomi/ShopLine-Ecommerce.git`

2. **Navigate to the project directory:** `cd ShopLine-Ecommerce`

3. **Install server dependencies:** `npm install`

4. **Navigate to the client directory:** `cd frontend`

5. **Install client dependencies:** `npm install`

6. **Return to the project directory:** `cd ..`

7. **Make Sure to Create a `config.env` file in backend/config directory and add appropriate variables in order to use the app:**
* `PORT`: Frontend port
* `DB_URI`: URI for the MongoDB database
* `JWT_SECRET`: Secret key for JSON Web Tokens
* `JWT_EXPIRE`: Period for JWT token expiration
* `COOKIE_EXPIRE` : Period for cookie expiration
* `STRIPE_SECRET_KEY`: Secret key for Stripe payments
* `STRIPE_API_KEY`: API key for stripe payments
* `SMPT_SERVICE`: Mail service
* `SMPT_MAIL`: Email for sending mails
* `SMPT_PASSWORD`: Password of respective email
* `SMPT_PORT`: Your smpt port
* `CLOUDINARY_NAME`: Your cloudinary name
* `CLOUDINARY_API_KEY`: Cloudinary API key
* `CLOUDINARY_API_SECRET`: Cloudinary API secret
_fill each variable with your info respectively_

8. **Start the development server:** `npm run dev`

## Features
* User authentication with JSON Web Tokens
* Product search and filtering
* Product pagination
* Product reviews and ratings
* Shopping cart functionality
* Checkout process with Stripe payments
* Admin dashboard

## Directory Structure
* frontend: React frontend
* backend: Express backend
* backend/config: Configuration files
* backend/controllers: Route handlers for server routes
* backend/middleware: Custom middleware functions
* backend/models: Mongoose models
* backend/routes: Server routes
* backend/utils: Utility functions

## Author
**LinkedIn** Click [Here](https://www.linkedin.com/in/omkar-kudale/)
