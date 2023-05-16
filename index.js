const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const readline = require('readline');
const { exec } = require('child_process');

const configPath = path.join(os.homedir(), 'config.json');
let config = {};

if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath));
}

if (!config.gitlab_url || !config.group_id || !config.access_token) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter GitLab URL (e.g., https://gitlab.com): ', gitlabUrl => {
        rl.question('Enter the group ID: ', groupId => {
            rl.question('Enter the access token: ', accessToken => {
                config.gitlab_url = gitlabUrl;
                config.group_id = groupId;
                config.access_token = accessToken;
                fs.writeFileSync(configPath, JSON.stringify(config));

                rl.close();
                fetchProjects();
            });
        });
    });
} else {
    fetchProjects();
}

function fetchProjects() {
    const { gitlab_url, group_id, access_token } = config;

    console.log(gitlab_url, group_id, access_token);

    let fullUrl = `${gitlab_url}/api/v4/groups/${group_id}/projects?private_token=${access_token}`;

    axios.get(fullUrl)
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
            console.error('Error:', error.message);
        });
}
