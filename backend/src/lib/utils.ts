export let todos = [
	{
		id: 1,
		title: "Buy groceries",
		description: "Purchase milk, bread, eggs, and vegetables from the store.",
		isDone: false,
	},
	{
		id: 2,
		title: "Finish project report",
		description:
			"Complete the pending sections and submit the report by the end of the day.",
		isDone: false,
	},
	{
		id: 3,
		title: "Exercise",
		description:
			"Do a 30-minute workout focusing on cardio and strength training.",
		isDone: true,
	},
	{
		id: 4,
		title: "Call mom",
		description: "Catch up with mom and check how she’s doing.",
		isDone: true,
	},
	{
		id: 5,
		title: "Plan weekend trip",
		description:
			"Decide on a destination and book accommodations for the upcoming weekend.",
		isDone: false,
	},
];

export const setTodos = (newTodos: any) => {
	todos = newTodos;
};
