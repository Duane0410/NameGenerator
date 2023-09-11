const Resource = require('../model/Resource');
const ResourceType = require('../model/ResourceType')
const Name=require('../model/Name')

const getAllResourceTypes = async (req, res) => {
    const resourceTypes = await ResourceType.find();
    if (!resourceTypes) {
        return res.status(204).json({ "message": 'No resourceTypes found!' });
    }
    res.json(resourceTypes);
}

const createNewResourceType = async (req, res) => {
    const { resource_type, name_categories, image_url } = req.body
    if (!resource_type || !name_categories || !image_url) {
        return res.status(400).json({ "message": 'Resource ID, resource type, name categories and image url are required!' });
    }

    const duplicate = await ResourceType.findOne({ resource_type: resource_type }).exec();
    if (duplicate) {
        return res.status(409).json({ "message": 'Resource type already exists!' });
    }
    console.log("\nresource_type - ", resource_type, "\nname_categories - ", name_categories, "\nimage_url - ", image_url)

    for (let i = 0; i < name_categories.length; i++) {
        console.log(`category ${i} - `, name_categories[i])
        const duplicate_category = await ResourceType.findOne({ name_categories: name_categories[i] }).exec();
        if (duplicate_category) {
            console.log("/nDup-Category - ",duplicate_category)
            return res.status(409).json({ "message": 'Name category already taken!' });
        }
    }

    console.log('After:')
        
    const result = await ResourceType.create({
        resource_type: resource_type,
        name_categories: name_categories,
        image_url: image_url
    })

    res.status(201).json(result);
}

const updateResourceType = async (req, res) => {
    const id = req?.body?._id
    console.log(id)
    if (!id) {
        return res.status(400).json({ "message": 'Resource ID parameter is required!' })
    }

    const foundResourceType = await ResourceType.findOne({ _id: id }).exec()
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

    const foundResourceType = await ResourceType.findOne({ _id: req.params.id }).exec()

    if (!foundResourceType) {
        return res.status(204).json({ "message": `No resource type matches ID ${req.params.id}.` });
    }

    let tempResource= []
    const resources = await Resource.find();
    resources.map(item => {
        if (item.resource === foundResourceType.resource_type) {
            tempResource.push(item)
        }
    })
    
    if(tempResource)
    {
        tempResource.map(async(delResource)=> {
            const foundName = await Name.findOne({ name: delResource.name }).exec();
            foundName.status = 'available';
            const nameResult = await foundName.save();
            const result = await delResource.deleteOne({ _id: delResource._id });
        console.log("deleted",result)
        })
    
        
    }

    const result = await foundResourceType.deleteOne({ _id: req.params.id });
    res.json(result);
}

const getResourceType = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'Resource type ID require!' })
    }

    const foundResourceType = await ResourceType.findOne({ _id: req.params.id }).exec()
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