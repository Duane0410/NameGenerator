const Resource = require('../model/Resource')
const Name = require('../model/Name');

const getAllResources = async (req, res) => {
    const resources = await Resource.find();
    if (!resources) {
        return res.status(204).json({ "message": 'No resources found!' });
    }
    res.json(resources);
}

const createNewResource = async (req, res) => {
    const { team_id, resource, name, category } = req.body
    if (!team_id || !resource || !name || !category) {
        return res.status(400).json({ "message": 'IT team ID, resource, name and category are required!' });
    }

    const duplicate = await Resource.findOne({ name: name }).exec()
    if (duplicate) {
        return res.status(409).json({ "message": 'Name already taken!' });
    }

    try {
        const foundName = await Name.findOne({ name: name }).exec();
        if (!foundName) {
            const nameResult = await Name.create({
                name: name,
                category: category,
                status: 'taken'
            })
        } else {
            if (foundName.status === 'taken') {
                return res.state(409).json({ "message": `${name} is already taken!`})
            } else {
                foundName.status = 'taken';

                const nameResult = await foundName.save();
            }
        }
        const result = await Resource.create({
            team_id: team_id,
            resource: resource,
            name: name
        })

        res.status(201).json(result);

    } catch (error) {
        console.error(error);
    }
}

const updateResource = async (req, res) => {
    const id = req?.body?._id
    console.log(id)
    if (!id) {
        return res.status(400).json({ "message": 'ID parameter is required!' })
    }

    const foundResource = await Resource.findOne({ _id: id }).exec()
    console.log(foundResource)

    if (!foundResource) {
        return res.status(204).json({ "message": `No name matches ID ${id}.` });
    }

    const duplicate = await Resource.findOne({ name: req.body.name }).exec()
    if (duplicate) {
        return res.status(409).json({ "message": 'Name already exists!' });
    }

    if (req.body?.resource) {
        foundResource.resource = req.body.resource;
    }
    if (req.body?.name) {
        if (!req.body.name || !req.body.category) {
            return res.status(400).json({ "message": 'When updating name both name and category are required!' });
        }

        const foundName = await Name.findOne({ name: req.body.name }).exec();
        if (!foundName) {
            const nameResult = await Name.create({
                name: req.body.name,
                category: req.body.category,
                status: 'taken'
            });
        } else {
            if (foundName.status === 'taken') {
                return res.status(409).json({ "message": `${req.body.name} is already taken!`});
            } else {
                foundName.status = 'taken';
                const nameResult = await foundName.save();
            }
        }
        const oldName= await Name.findOne({ name: foundResource.name }).exec();
        oldName.status="available";
        const oldResult = await oldName.save();

        foundResource.name = req.body.name;
        // console.log(nameResult)
    }
    const result = await foundResource.save();
    res.json(result);
}

const deleteResource = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Resource ID require!' })
    }

    const foundResource = await Resource.findOne({ _id: req.params.id }).exec()


    const foundName = await Name.findOne({ name: foundResource.name }).exec();
    foundName.status = 'available';
    const nameResult = await foundName.save();

    if (!foundResource) {
        return res.status(204).json({ "message": `No resource matches ID ${req.params.id}.` });
    }

    const result = await foundResource.deleteOne({ _id: req.params.id });
    res.json(result);
}

const getResource = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Resource ID require!' })
    }

    const foundResource = await Resource.findOne({ _id: req.params.id }).exec()
    if (!foundResource) {
        return res.status(204).json({ "message": `No Resource matches ${req.params.id}.` });
    }
    res.json(foundResource);
}

module.exports = {
    getAllResources,
    createNewResource,
    updateResource,
    deleteResource,
    getResource
}