const ResourceType = require('../model/ResourceType')

const getAllResourceTypes = async (req, res) => {
    const resourceTypes = await ResourceType.find();
    if (!resourceTypes) {
        return res.status(204).json({ "message": 'No resourceTypes found!' });
    }
    res.json(resourceTypes);
}

const createNewResourceType = async (req, res) => {
    const { type_id, resource_type, name_categories, image_url } = req.body
    if (!type_id || !resource_type || !name_categories || !image_url) {
        return res.status(400).json({ "message": 'Resource ID, resource type, name categories and image url are required!' });
    }

    const duplicate = await ResourceType.findOne({ resource_type: resource_type }).exec()
    if (duplicate) {
        return res.status(409).json({ "message": 'Resource type already exists!' });
    }
    console.log("\ntype_id - ", type_id, "\nresource_type - ", resource_type, "\nname_categories - ", name_categories, "\nimage_url - ", image_url)

    const result = await ResourceType.create({
        type_id: type_id,
        resource_type: resource_type,
        name_categories: name_categories,
        image_url: image_url
    })

    res.status(201).json(result);
}

const updateResourceType = async (req, res) => {
    const id = req?.body?.type_id
    console.log(id)
    if (!id) {
        return res.status(400).json({ "message": 'Resource ID parameter is required!' })
    }

    const foundResourceType = await ResourceType.findOne({ type_id: id }).exec()
    console.log(foundResourceType)

    if (!foundResourceType) {
        return res.status(204).json({ "message": `No resource type matches ID ${id}.` });
    }

    // const duplicate = await ResourceType.findOne({ resource_type: req.body.resource_type }).exec()
    // if (duplicate) {
    //     return res.status(409).json({ "message": 'Resource type already exists!' });
    // }

    if (req.body?.resource_type) {
        foundResourceType.resource_type = req.body.resource_type;
    }
    if (req.body?.image_url) {
        foundResourceType.image_url = req.body.image_url;
    }
    const result = await foundResourceType.save();
    res.json(result);
}

const deleteResourceType = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Resource type ID require!' })
    }

    const foundResourceType = await ResourceType.findOne({ type_id: req.params.id }).exec()

    if (!foundResourceType) {
        return res.status(204).json({ "message": `No resource type matches ID ${req.params.id}.` });
    }

    const result = await foundResourceType.deleteOne({ type_id: req.params.id });
    res.json(result);
}

const getResourceType = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Resource type ID require!' })
    }

    const foundResourceType = await ResourceType.findOne({ type_id: req.params.id }).exec()
    if (!foundResourceType) {
        return res.status(204).json({ "message": `No Resource type matches ${req.params.id}.` });
    }
    res.json(foundResourceType);
}

module.exports = {
    getAllResourceTypes,
    createNewResourceType,
    updateResourceType,
    deleteResourceType,
    getResourceType
}