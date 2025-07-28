import Room from '../models/Room';

const createTestRoom = async (userId: string, questionId: string) => {
    const room = await Room.create({
        players: [{ player: userId, score: 0 }],
        status: 'waiting',
        problemId: questionId,
        name: `Test Room for ${userId}`
    });
    return room;
};

export default createTestRoom;
