const GoalModel = require('../models/goalModel')
const UserModel = require('../models/userModel')

const getGoals = async (req, res) =>{
    try {
        const goals = await GoalModel.find({ user: req.user.id });
        res.status(200).json(goals)
    } catch (error) {
        return res.status(500).json({
				success: false,
				error: 'Could not get the goals'
			})
    }
}

const setGoal = async (req, res) =>{
    if(!req.body.text){
        res.status(400).json({message: "Bad request, text field is undefined"})
    }

    try {
        const createGoal = await GoalModel.create({
            text: req.body.text,
            user: req.user.id
        });
        res.status(200).json({
            message: "SET a new goal",
            data: createGoal
        })
    } catch (error) {
        return res.status(500).json({
				success: false,
				error: 'Could not create the goal'
			})
    }
}

const updateGoal = async (req, res) =>{
    let currGoal;
    try {
        currGoal = await GoalModel.findById(req.params.id);
    } catch (error) {
        res.status(500).json({message: `Problem with retrieving the goal with id ${req.params.id}`});
    }

    try {
        const specificUser = await UserModel.findById(req.user.id);

        //check that user exists
        if(!specificUser){
            res.status(401).json({message: 'User not found'});
        }

        //Make sure that the logged in user, matches with the goal's user
        if(currGoal.user.toString() != specificUser.id){
            res.status(401).json({message: 'User not authorized'});
        }

        const updatedGoal = await GoalModel.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.status(200).json({
            message: "Goal has been updated successfully",
            data: updatedGoal
        });

    } catch (error) {
        res.status(500).json({message: `Problem with updating the goal with id ${req.params.id}`});
    }
}

const deleteGoal = async (req, res) =>{
    try {
        const currGoal = await GoalModel.findById(req.params.id);

        const specificUser = await UserModel.findById(req.user.id);

        //check that user exists
        if(!specificUser){
            res.status(401).json({message: 'User not found'});
        }

        //Make sure that the logged in user, matches with the goal's user
        if(currGoal.user.toString() != specificUser.id){
            res.status(401).json({message: 'User not authorized'});
        }
    } catch (error) {
        res.status(500).json({message: `Problem with retrieving the goal with id ${req.params.id}`});
    }

    try {
        const deletedGoal = await GoalModel.findByIdAndRemove(req.params.id);
        res.status(200).json({
            message: "Goal has been deleted successfully",
            data: deletedGoal
        });
    } catch (error) {
        res.status(500).json({message: 'Could not delete this goal'});
    }
}

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}