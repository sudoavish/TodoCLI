import { Command } from 'commander';
const program = new Command();
import fs from 'fs';
import chalk from 'chalk';

const path = './todo.txt';
const readTodo = () =>{
    try {
        const data = fs.readFileSync(path,'utf-8')
        return data.split('\n').filter(line => line.trim() != '');
    } catch (error) {
        if(error.code === 'ENOENT'){
            return [];
        } else {
            throw error;
        }
    }
};

const saveTodo = (todos) => {
    const data = todos.join('\n');
    fs.writeFileSync(path,data);
}

program.name('todo')
    .description('This CLI makes todo for you')
    .version('0.8.0')


program.command('add')
    .description('Lets you add a todo')
    .argument('<string>','add your todo')
    .action((todo)=>{

        let todos = readTodo();
        todos.push(todo);
        saveTodo(todos);
        console.log(chalk.red.bold(`Todo Added: ${todo}`))

    })


program.command('show')
    .description('show all the todos')
    .action(()=>{
        let todos = readTodo();
        if(todos.length === 0){
            console.log(chalk.yellow('Todo is empty'));
        } else {
            todos.forEach((element, index) => {

                if(element.startsWith('[Completed]')){
                    console.log(chalk.green(`${index+1}: ${element}`));
                } else {
                    console.log(chalk.red(`${index+1}: ${element}`));
                }
            });
        }
    })


program.command('delete')
    .description('delete your last todo')
    .action(()=> {
        let todos = readTodo();

        if(todos.length !== 0){
            todos.pop();
            console.log(chalk.blue('Last todo deleted'));
            saveTodo(todos);
        } else {
            console.log(chalk.yellow('Your todo is empty'));
        }
    })


program.command('edit')
    .description('Edit an existing todo')
    .argument('<old>','old todo string to be replaced')
    .argument('<new>','The new todo string to replace the new one')
    .action((oldTodo,newTodo) => {
        let todos = readTodo();
        const index = todos.indexOf(oldTodo);
        if(index == -1){
            console.log(chalk.yellow('Todo not found'));
        } else {
            todos[index] = newTodo
            saveTodo(todos);
            console.log(`Todo updated: "${oldTodo}" to "${newTodo}"`);
        }
    })

program.command('complete')
    .description('mark todo as complete')
    .argument('<string>','add exact todo name to complete')
    .action((todo)=> {
        let todos = readTodo();

        const index = todos.indexOf(todo);

        if(index == -1){
            console.log(chalk.yellow('Todo not found'))
        } else {
            todos[index] = `[Completed] ${todos[index]}`;
            console.log(chalk.green.bold(`${todos[index]}`));
            saveTodo(todos);
        }
    })

program.parse();