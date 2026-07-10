import mysql from 'mysql2/promise';

let authPoolInstance: mysql.Pool | null = null;
let uniPoolInstance: mysql.Pool | null = null;

//this is dumb, but if I don't do it this way, this method is instantiated
//BEFORE .env is loaded, meaning we don't have any variables for the database
//for some reason
//So I guess pool is a function instead of a variable now, to force it to only load
//configs the first time it's called
export const getAuthDbPool = (): mysql.Pool => {
    // The pool is only instantiated the first time this function is called
    if (!authPoolInstance) {
        authPoolInstance = mysql.createPool({
            host: process.env.AUTH_DB_HOST,
            user: process.env.AUTH_DB_USER,
            password: process.env.AUTH_DB_PASSWORD,
            database: process.env.AUTH_DB_NAME,
            port: 3306,
            charset: "UTF8MB4_UNICODE_CI",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    //console.log(process.env.DB_NAME);
    return authPoolInstance;
};

export const getInstitutionDbPool = (): mysql.Pool => {
    if (!uniPoolInstance) {
        uniPoolInstance = mysql.createPool({
            host: process.env.INST_DB_HOST,
            user: process.env.INST_DB_USER,
            password: process.env.INST_DB_PASSWORD,
            database: process.env.INST_DB_NAME,
            port: 3308,
            charset: "UTF8MB4_UNICODE_CI",
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    //console.log(process.env.DB_NAME);
    return uniPoolInstance;
}