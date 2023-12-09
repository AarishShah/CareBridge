const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./zakat') 

const userSchema = new mongoose.Schema
    (
        {
            name:
            {
                type: String,
                required: true, // this field needs to be present or data field won't be created
                trim: true
            },

            email:
            {
                type: String,
                unique: true, // this will make sure that every email different
                required: true,
                trim: true,
                lowercase: true,

                validate(value)
                {
                    if (!validator.isEmail(value))
                    {
                        throw new Error('Email is invalid')
                    }
                }
            },

            age:
            {
                type: Number,
                default: 0,
                validate(value)
                {
                    if (value < 0)
                    {
                        throw new Error('Age must be a positive number')
                    }
                },
                trim: true
            },

            password:
            {
                type: String,
                required: true,
                minlength: 7,
                trim: true,
                validate(value)
                {
                    if (value.toLowerCase().includes('password'))
                    {
                        throw new Error('Password cannot contain "password"')

                    }
                }

            },

            /*
            
            Once we’ve saved our user to the database, we create a token by calling a method ‘generateAuthToken()’ that I’ve also put in the user schema file. We’re also going to add to the User schema by adding an array of tokens. The array is what allows for multiple devices to be logged in. If it were only one token, you’d only be able to login from one device at a time. If you attempted to login from another, it would login from the attempted device and logout of the previous. Therefore, we add to our schema the array of tokens and make it required.
            
            Source: https://medium.com/swlh/authenticating-users-node-js-59d6a08fd6a2
            */
            tokens:
                [ // declaration of array
                    { // declaration of array of objects
                        token: // first item of this object
                        {
                            type: String,
                            required: true
                        }
                    }

                ],

            avatar:
            {
                type: Buffer
            },

        },
        {
            timestamps: true
        }
    )

userSchema.virtual('calculations', // any name would do --- virtaul tell mongoose how these two things are related --- note: this needed to be same as ref, altho Andrew said that it was not the case
    {
        ref: 'calculator', // reference is with Task, this is also case-sensitive
        localField: '_id', // where local data is stored --- basically owner field in tasks use userID so it's a common thing that is helping is in creating a relationship b/w the data
        foreignField: 'userId' // name of the other field which is relating the data of tasks with users
    }
)

// this method will display user data in restricted manner (hide password, tokens etc)
// userSchema.methods.getPublicProfile = function ()
userSchema.methods.toJSON = function () // this way we dont need to change every instance of user to 'user.getPublicProfile'
{
    const user = this
    const userObject = user.toObject() // this way we will get the user data excluding the mongoose created fn (like save())

    // now we will modifie the data in userObject
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.geenerateAuthToken = async function (next) //  methods is available on instances (or instance methods)
{
    const user = this // This function uses ‘this’ to symbolize the specific instance of a user.
    const token = jwt.sign({ _id: user.id.toString() }, 'thisismynewcourse')

    // to store the token associated with the user in the DB
    user.tokens = user.tokens.concat({ token }) // concat({token:token}) //From here we see that we append the token inside of the tokens attribute array of the user and then we save.
    await user.save()

    return token

}

userSchema.statics.findByCredentials = async (email, password) => // static is available on model (or model methods)
{
    const user = await User.findOne({ email }) // shorthand for async User.findOne({email:email})

    if (!user)
    {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
    {
        throw new Error('Unable to login')
    }
    return user

}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) // 1st parameter = name of the event, 2nd parameter = normal fn and not the arrow fn. This is because we will be using 'this' which is not a binding in the arrow fn
{
    const user = this

    if (user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
}
)

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next)
{
    const user = this
    await Task.deleteMany({ owner: user._id })

    next()
}
)

const User = mongoose.model('user', userSchema)

module.exports = User