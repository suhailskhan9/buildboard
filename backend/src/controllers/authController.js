import * as authService from '../services/authService.js';


export async function signupController(req, res) {
    const { email, username, password } = req.body;
        
    await authService.signup({ email, username, password});

    return res.status(201).json({
        message: "User created successfully"
    })
}

export async function loginController(req, res) {
    const { email, password } = req.body; 

    const token = await authService.login({ email, password });

    return res.status(200).json({
        message: "Login successful",
        token: token
    })
}
