const { nanoid } = require('nanoid');
const ApiKey = require('../models/ApiKey');
const toHandleAsync = require('../utilities/toHandleAsync');
// const toEmail = require('../utilities/toEmail');
const toEncrypt = require('../utilities/toEncrypt');
const fs = require('fs')
const path = require('path')

/**
 * !PATH: /api/v1/key
 * process and api key for a given email address on req.body
 */
const processAnApiKey = toHandleAsync(async (req, res, next) => {
    const { email } = req.body;
    console.log(email)
    const randomKey = nanoid(12);

    const randomKeyEncrypted = toEncrypt(randomKey)

    const foundApiKey = await ApiKey.findOne({ email })

    // if email requested before
    if (foundApiKey) {
        foundApiKey.key = randomKeyEncrypted;
        await foundApiKey.save()

        // await toEmail(email, 'Dummy Products API Key RESET', `
        //     Here is your new api key: ${randomKey}
        // `)
        fs.appendFile(path.join(__dirname, '..', 'key'), `${randomKey}\n\n`, (err) => {console.log(err)})

        return res.json({
            success: true,
            datatype: 'API KEY RESET. Existing User',
            message: 'Existing user found. Successfully reset your api key and sent it to your email'
        })
    }

    // if email requested first time
    await ApiKey.create({ key: randomKeyEncrypted, email });

    // await toEmail(email, 'Dummy Products API Key', `
    //     Here is your api key: ${randomKey}
    // `)

    fs.appendFile(path.join(__dirname, '..', 'key'), randomKey, (err) => {console.log(err)})

    res.json({
        success: true,
        datatype: 'API KEY REQUEST',
        message: 'Successfully created your api key and sent it to your email'
    })
})

module.exports = {
    processAnApiKey,
}