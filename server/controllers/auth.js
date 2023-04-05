import User from '../models/User.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken" // нужен для того чтобы смотреть вошли мы или нет и есть ли у нас токен, формирует его 
// req = request - то что приходит со стороны клиента(логин и пароль например, в req.body лежат данные)
// res = response - обратно отправляем клиентские обработанные данные через это
// reg user
export const register = async (req, res) => {
    try {
        const { username, password } = req.body

        const isUsed = await User.findOne({ username }) // ищем пользователя по username
        
        if(isUsed) {
            return res.json({
                message: 'Данный username уже занят'
            })
        }

        const salt = bcrypt.genSaltSync(10) // задаём сложность 
        const hash = bcrypt.hashSync(password, salt) // шифруем пароль

        const newUser = new User({ // формируем нового юзера
            username,
            password: hash,
        })

        await newUser.save() // сохраняем пользователя в бд

        res.json({
            newUser, message: "Регистрация прошла успешно",
        })

    } catch (error) {
        res.json({ message: "Ошибка при создании пользователя" })
        }
    }
// log user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })

        if(!user) {
            return res.json({
                message: 'Такого юзера не существует'
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password) // сравниваем хэшированные пароли

        if(!isPasswordCorrect) {
            return res.json({
                message: "Неверный пароль",
            })
        }
        const token = jwt.sign( // формируем токен(цифровой ключ)
            { 
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        ) 

        res.json({ // тут мы возвращаем с бекенда 
            token, user, message: "Вы вошли в систему"
        })

    } catch (error) {
        res.json({ message: "Ошибка при авторизации"} )
        }
    }
// getMe
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId) // ищем юзера по айди

        if(!user) {
            return res.json({
                message: 'Такого юзера не существует'
            })
        }

        const token = jwt.sign( // снова создаём токен, тк токен зависит от айдишника, то он такой же как и в логине
            { 
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        ) 

        res.json({
            user,
            token,
        })

    } catch (error) {
        res.json({ message: "Нет доступа" })
        }
    }