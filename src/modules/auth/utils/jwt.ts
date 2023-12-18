import jsonwebtoken from 'jsonwebtoken';

class JWT {
    public static generateToken(data: any): string {
        return jsonwebtoken.sign(
            data,
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
    }
}

export default JWT;