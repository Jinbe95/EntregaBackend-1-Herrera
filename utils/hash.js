import bcrypt from 'bcrypt';

// Crear hash del password
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Validar password con hash
export const isValidPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};
