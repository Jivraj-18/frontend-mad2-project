import authRoutes from './auth.js'
import userRoutes from './user.js'
import librarianRoutes from './librarian.js'

export default[
    ...authRoutes,
    ...userRoutes,
    ...librarianRoutes,
]