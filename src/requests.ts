export const genreSchema = {
    type: 'object',
    properties: {
        genre: {type: 'string'},
    },
    required: ['genre'],
    additionalProperties: false
};