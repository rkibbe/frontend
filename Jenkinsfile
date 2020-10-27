pipeline {
  options {
    timeout(time: 1, unit: 'HOURS')
  }
  agent {
    label 'master'
  }
  parameters {
    choice(
      name: 'jobEnv',
      choices: 'dev\nsit\nppr\nprf\nint\nprd',
      description: "deploy environment"
    )
    choice(
      name: 'app',
      choices: 'verti\nmapfre',
      description: "choose which fusion app you want verti or mapfre to build"
    )
  }
  environment {
    workspaceName = "${app}_Jenkins"
    workspaceDir = "${BUILD_TAG}"
    envURL = " "
    notifyBodyLog = " "
    remote_dir_int = " "
    remote_dir_ext = " "
    remote_base = " "
    changeSet = " "
    branch = " "
  }
  triggers {
    parameterizedCron('''
      H */1 * * * %jobEnv=dev;app=mapfre
      H */1 * * * %jobEnv=dev;app=verti
			''')
  }
  stages {
    // Initial workspace cleaning
    stage('Clean Workspace') {
      steps {
        deleteDir()
        script {
          if (fileExists("${workspaceName}_${jobEnv}")) {
            echo "Removing existing plastic workspace.."
            sh "rm -rf ${workspaceName}_${jobEnv}"
          }
        }
      }
    }
    stage('Pull Source') {
      steps {
        dir("${BUILD_TAG}") {
          script {
            switch ("$params.jobEnv") {
              case "prd":
                branch = "master"
                break
              case "ppr":
                branch = "release"
                break
              case "prf":
                branch = "release"
                break
              case "sit":
                branch = "release"
                break
              case "emer":
                branch = "master"
                break
              case "dev":
                branch = "develop"
                break
            }
            script {
              // Get the code from BitBucket
              git branch: "${branch}", credentialsId: 'jenkins-bitbucket', url: 'git@bitbucket.org:mapfre-usa/fusion.git'
              latestHash = sh(script: "git rev-parse HEAD", returnStdout: true)
              pullRequest = sh(script: "git log --pretty=format:\"%h\" | sed -n '1p'", returnStdout: true).trim()
              echo "Latest Hash       : ${latestHash}"
              echo "Latest PullRequest: ${pullRequest}"
            }
          }
        }
      }
    }
    stage('Build Source') {
      steps {
        dir("${workspaceDir}/frontend") {
          sh "npm install && npm run build_${jobEnv}_${app}"
        }
      }
    }
    // stage('Unit Test') {
    //   when {
    //     expression {
    //       // Only run if karma.conf.js exists
    //       if (fileExists("${workspaceDir}/frontend/src/karma.conf.js") && params.jobEnv == "dev") {
    //         return true
    //       }
    //     }
    //   }
    //   steps {
    //     catchError(buildResult: 'UNSTABLE', message: '---- Unit Tests Failed ----', stageResult: 'FAILURE') {
    //       dir("${workspaceDir}/frontend") {
    //         sh "ng test --watch=false --code-coverage --karma-config src/karma.conf.js"
    //       }
    //     }
    //   }
    // }
    // stage('Sonar Analyze') {
    //   // Runs SonarQube testing based on generic profiles and pushes data to the Sonar Dashboard
    //   when {
    //     // Only runs sonar for dev and sit environments
    //     expression {
    //       params.jobEnv == "dev"
    //     }
    //   }
    //   steps {
    //     withSonarQubeEnv('SonarPrd') {
    //       dir("${workspaceDir}/frontend") {
    //         sh '${scannerHome}/sonar-scanner -Dsonar.projectName=${app} -Dsonar.tests=src/app -Dsonar.sources=src -Dsonar.projectKey=Angular:${app} -Dsonar.exclusions=**/node_modules/**,**/*.spec.ts -Dsonar.test.inclusions=**/*.spec.ts'
    //       }
    //     }
    //   }
    // }
    stage('Deploy Dev') {
      when {
        expression {
          params.jobEnv == "dev"
        }
      }
      steps {
        echo "deploy to DEV"
        script {
            int_servers = ['webdl002-gr']
            docroot_int = "/mapfre/runtime/webserver/content/fusion_${app}/docroot"
            commands_int = "sudo cp -rp /home/jenkins/fusion_${app}/* ${docroot_int}/; sudo cp -rp /home/jenkins/fusion_${app}_httpd/fusion_${app}/* /mapfre/runtime/webserver/content/fusion_${app}/run/conf/; sudo chown -R was.was ${docroot_int}; sudo chown -R was.was /mapfre/runtime/webserver/content/fusion_${app}/run/conf/"
            sshagent(['709e9fc3-5abd-4861-893c-d19e5ac86856']) { //jenkins user
                int_servers.each {
                    sh "ssh -q jenkins@${it} mkdir -p /home/jenkins/fusion_${app}"
                    sh "scp -r -q -o StrictHostKeyChecking=no -rp ${env.WORKSPACE}/${workspaceDir}/frontend/dist/* jenkins@${it}:/home/jenkins/fusion_${app}/"
                    sh "scp -r -q -o StrictHostKeyChecking=no -rp ${env.WORKSPACE}/${workspaceDir}/httpd/* jenkins@${it}:/home/jenkins/fusion_${app}_httpd/"
                    sh "ssh -q jenkins@${it} \"${commands_int}\""
                    sh "ssh -q jenkins@${it} sudo systemctl restart fusion_${app}.httpd.service"
                }
            }
        }
      }
    }
  }
}