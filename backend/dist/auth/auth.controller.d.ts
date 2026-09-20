import { AuthService } from './auth.service.js';
import { LoginDto } from './auth.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
            access_token: string;
            user: {
                id: string;
                name: string;
                email: string;
                role: string;
            };
        };
    }>;
}
