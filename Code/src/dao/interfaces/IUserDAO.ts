// my_code
import {User} from "../../model/user";
import {userRole} from "../../model/user";


export interface IUserDAO {
    /**
     * Searches the database to find stored user data. Returning null if no user with the
     * given email was found.
     *
     * @param email user email
     * @returns: valid user, or null
     */
    getUser (email: String) : Promise<User | null>;

    /**
     * Searches database to find stored hashed password, returning
     * null if no user with the given email was found.
     *
     * @param email
     * @returns: existing hashed password or null
     */
    getPassword(email: string): Promise<string | null>;

    /**
     * Returns all users in the system.
     */
    getAllUsers(): Promise<User[]>;

    /**
     * Returns a single user by their EmployeeID, or null if not found.
     *
     * @param id EmployeeID
     */
    getUserById(id: number): Promise<User | null>;

    /**
     * Creates a new employee + credentials record.
     *
     * @param firstName
     * @param lastName
     * @param email
     * @param hashedPassword  bcrypt hash of the plain-text password
     * @param role
     */
    createUser(firstName: string, lastName: string, email: string, hashedPassword: string, role: userRole): Promise<void>;

    /**
     * Updates an existing user. If hashedPassword is provided the stored hash is replaced.
     *
     * @param id            EmployeeID
     * @param firstName
     * @param lastName
     * @param email
     * @param role
     * @param hashedPassword  optional — leave undefined to keep existing password
     */
    updateUser(id: number, firstName: string, lastName: string, email: string, role: userRole, hashedPassword?: string): Promise<void>;

    /**
     * Deletes a user (both Employees and Credentials rows).
     *
     * @param id EmployeeID
     */
    deleteUser(id: number): Promise<void>;
}