const getGoals = async (req, res) =>{
    res.status(200).json({message: "GET request for goals"})
}

const setGoal = async (req, res) =>{
    if(!req.body.text){
        res.status(400).json({message: "Bad request, text field is undefined"})
    }

    res.status(200).json({message: "SET a new goal"})
}

const updateGoal = async (req, res) =>{
    res.status(200).json({message: `UPDATE goal with id ${req.params.id}`})
}

const deleteGoal = async (req, res) =>{
    res.status(200).json({message: `DELETE goal with id ${req.params.id}`})
}

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}