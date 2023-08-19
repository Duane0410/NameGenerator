const Name = require('../model/Name');

const getAllNames = async (req, res) => {
    const names = await Name.find();
    if (!names) {
        return res.status(204).json({ "message": 'No names found!' });
    }
    res.json(names);
}

const createNewName = async (req, res) => {
    if (!req?.body?.name || !req.body?.category) {
        return res.status(400).json({ "message": 'Name and category are required!' });
    }

    const exists = await Name.findOne({ name: req.body.name }).exec()
    if (exists) {
        return res.status(409).json({ "message": 'Name already exists!' });
    }

    try {
        const result = await Name.create({
            name: req.body.name,
            category: req.body.category
        })

        res.status(201).json(result)
    } catch (error) {
        console.error(error)
    }
}

const updateName = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": 'ID parameter is required!' })
    }

    const name = await Name.findOne({ _id: req.body.id }).exec()

    if (!name) {
        return res.status(204).json({ "message": `No name matches ID ${req.body.id}.` });
    }

    const exists = await Name.findOne({ name: req.body.name }).exec()
    if (exists) {
        return res.status(409).json({ "message": 'Name already exists!' });
    }

    if (req.body?.name) {
        name.name = req.body.name;
    }
    if (req.body?.category) {
        name.category = req.body.category;
    }
    if (req.body?.status) {
        name.status = req.body.status;
    }
    const result = await name.save();
    res.json(result);
}

const deleteName = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": 'Name ID require!' })
    }

    const name = await Name.findOne({ _id: req.body.id }).exec()

    if (!name) {
        return res.status(204).json({ "message": `No name matches ID ${req.body.id}.` });
    }
    const result = await name.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getName = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Name ID require!' })
    }

    const name = await Name.findOne({ _id: req.params.id }).exec()
    if (!name) {
        return res.status(204).json({ "message": `No name matches ID ${req.params.id}.` });
    }
    res.json(name);
}

module.exports = {
    getAllNames,
    createNewName,
    updateName,
    deleteName,
    getName
}