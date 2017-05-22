module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
         sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                    style: 'expanded',
                    lineNumbers: true
                },
                files: {                         // Dictionary of files
                    '../themes/tweme/css/style.css': 'scss/styles.scss'       // 'destination': 'source
                }
            }
        },
        
         bake: {
            your_target: {
                options: {
                    // Task-specific options go here.
                },

                files: {
                    // files go here, like so:
                    //"templates/page.tpl.php": "dev-templates/page.tpl.php"
                }
            },
        },
        

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            
            
             bake: {
                files: [
                    'dev-templates/**/*.php'
                ],
                tasks: ['bake']
            },
            
            sass: {
                files: [
                    'scss/**/*.scss'
                ],
                tasks: ['sass', 'postcss']
            }
            
        },
        
        postcss: {
            options: {
              processors: [
                require('autoprefixer')({browsers: ['last 2 versions', 'ie 10']}),
              ]
            },
            dist: {
              src: 'css/style.css'
            }
        }, 

    });

    // load npm modules
    grunt.loadNpmTasks('grunt-bake');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');


    // register tasks
    grunt.registerTask('default', ['bake', 'sass', 'postcss',  'watch']);
    grunt.registerTask('jenkins', ['bake', 'sass', 'postcss']);
};
