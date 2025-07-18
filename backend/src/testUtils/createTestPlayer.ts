import Player from '../models/Player';

const createTestPlayer = async (
    username: string,
    password: string,
    email: string
) => {
    const player = await Player.create({
        username,
        password,
        email,
    });
    return player;
};
export default createTestPlayer;
