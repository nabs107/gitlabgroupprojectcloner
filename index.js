const axios = require('axios');
const readline = require('readline');
const { exec } = require('child_process');

if (process.argv.length != 5) {
    console.error('🛑 Please provide gitlab url, project id and access token in order');
    process.exit(1);
} else {
    let gitlabUrl = process.argv[2] + '';
    let gitlabGroupId = process.argv[3] + '';
    let gitlabProjectUrl = gitlabUrl + gitlabGroupId;
    let accessToken = process.argv[4] + '';
    axios.get(gitlabProjectUrl + '/projects?private_token=' + accessToken)
        .then(response => {
            const projects = response.data;

            // Process the projects list
            console.log('Available Projects:');
            projects.forEach(project => {
                console.log(project.name, project.id);
            });

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the project ID to clone: ', projectId => {
                const selectedProject = projects.find(p => p.id.toString() === projectId);

                if (selectedProject) {
                    const cloneUrl = selectedProject.http_url_to_repo;
                    console.log('Cloning project...');
                    console.log('Cloning ' + selectedProject.name);
                    exec(`git clone ${cloneUrl}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error('Error:', error.message);
                        } else {
                            console.log('Project cloned successfully.');
                        }
                        rl.close();
                    });
                } else {
                    console.log('Invalid project ID.');
                    rl.close();
                }

                rl.close();

            });

        })
        .catch(error => {
            console.log(error);
        });
}