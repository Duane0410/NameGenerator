const Name = require('../model/Name');

const getAllNames = async (req, res) => {
    const names = await Name.find();
    if (!names) {
        return res.status(204).json({ "message": 'No names found!' });
    }
    res.json(names);
}

const createNewName = async (req, res) => {
    const {name, category} = req.body
    if (!name || !category) {
        return res.status(400).json({ "message": 'Name and category are required!' });
    }

    const duplicate = await Name.findOne({ name: name }).exec()
    if (duplicate) {
        return res.status(409).json({ "message": 'Name already exists!' });
    }

    try {
        const result = await Name.create({
            name: name,
            category: category
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

    const foundname = await Name.findOne({ _id: req.body.id }).exec()

    if (!foundname) {
        return res.status(204).json({ "message": `No name matches ID ${req.body.id}.` });
    }

    const duplicate = await Name.findOne({ name: req.body.name }).exec()
    if (duplicate) {
        return res.status(409).json({ "message": 'Name already exists!' });
    }

    if (req.body?.name) {
        foundname.name = req.body.name;
    }
    if (req.body?.category) {
        foundname.category = req.body.category;
    }
    if (req.body?.status) {
        foundname.status = req.body.status;
    }
    const result = await foundname.save();
    res.json(result);
}

const deleteName = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ "message": 'Name ID require!' })
    }

    const foundname = await Name.findOne({ _id: id }).exec()

    if (!foundname) {
        return res.status(204).json({ "message": `No name matches ID ${id}.` });
    }
    const result = await name.deleteOne({ _id: id });
    res.json(result);
}

const getName = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Name ID require!' })
    }

    const foundname = await Name.findOne({ _id: req.params.id }).exec()
    if (!foundname) {
        return res.status(204).json({ "message": `No name matches ID ${req.params.id}.` });
    }
    res.json(foundname);
}

module.exports = {
    getAllNames,
    createNewName,
    updateName,
    deleteName,
    getName
}