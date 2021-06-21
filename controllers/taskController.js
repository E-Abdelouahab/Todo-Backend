const Task = require('./../models/taskModel');


exports.createTask = (req, res) => {
    const task = new Task(req.body);


    task.save((err, task) => {
        if(err){
           return  res.status(400).json({
                error: 'Bad request, todo do not created !!!!'
            })
        }

        res.json({
            task
        })
    })
}



exports.taskId = (req, res, next , id) => {
    Task.findById(id).exec((err, task) => {
        if( err || !task) {
            return res.status(404).json({
                error: "Todo Id is not found !!!"
            })
        }

        req.task = task;

        next();
    })
}


exports.showTask = (req, res) => {
    let task = req.task;

    res.json({
        task
    })
}


exports.updateTask = (req, res) => {
    let task = req.task;
    task.name = req.body.name;
    task.description = req.body.description;

    task.save((err, task) => {
        if(err) {
            return res.status(400).json({
                error : "bad request, Todo isn't updated"
            })
        }

        res.json({
            task,
            message : 'Todo Updated'
        })
    })
}

exports.deleteTask = (req, res) => {
    let task = req.task

    task.remove((err, task) =>  {
        if(err) {
            return res.status(404).json({
                error : "this todo is not found"
            })
        }

        res.status(204).json({
            message: 'todo is deleted'
        })
    })
}

exports.allTasks = (req, res) => {
    Task.find().exec((err, tasks) => {
        if(err) {
            return res.status(500).json({
                error: err
            })
        }

        res.json({
            tasks
        })
    })
}


exports.searchTask = (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let order = req.query.order ? req.query.order : "asc"; // a-z not z-a il prend en consédiration l'alhabétique de les mots les produits
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip)
    let findArgs = {}
    console.log(req.body.filters)

    for(let key in req.body.filters){
        if(req.body.filters[key].length > 0){
       
     if(key === "name"){
            
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            }else{
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Task.find(findArgs)
    .populate('category') // afficher la category de la produit dans uri
    .sort([[sortBy, order]])
    .limit(limit)
    .skip(skip)
    .exec((err, tasks) => {
        if(err){
            return res.status(404).json({
                error: "Todos not found"
            })
        }
        res.json({
            tasks
        })
    })

}