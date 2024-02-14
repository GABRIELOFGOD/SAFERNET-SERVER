const cloudinary = require("../config/cloudinary.config");
const { eventCreature } = require("../utils/creator");
const { checkEvent, getEvent } = require("../utils/dbChecker");


const createEvent = async (req, res) => {
    const{ title, about, date, time, venue } = req.body;
    try {
        
        if(!title) return res.status(402).json({error: 'Event must have at least title', success: false})

        const isExists = await checkEvent(title);
        if(isExists) return res.status(402).json({error: 'This Event has been posted before.'})

        if(req.file){
            const cloudinaeryImage = cloudinary.uploader.upload(req.file.path, async (err, result) => {
                if(err) return res.status(402).json({error: 'Check if image is not larger than 10mb, if the problem persists, reach to our support team', success: false, errLog: err})

                const event = {
                    title,
                    about,
                    date,
                    time,
                    venue,
                    image: result.secure_url
                }
                const newEvent = await eventCreature(event);
                return res.json({message: 'Event uploaded successfully'})
            })
        }

        const event = {
            title,
            about,
            date,
            time,
            venue
        }
        const newEvent = await eventCreature(event);
        res.json({message: 'Event uploaded successfully'})
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}

const allEvents = async (req, res) => {
    try {
        const events = await getEvent();
        res.json(events)
    } catch (err) {
        res.status(401).json({error: 'something went wrong check the error log or try again later', success: false, errLog: err})
    }
}

module.exports = { createEvent, allEvents }