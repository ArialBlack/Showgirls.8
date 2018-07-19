module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
         sass: {                              // Task
            dist: {                            // Target
                options: {                       // Target options
                },
                files: {                         // Dictionary of files
                    '../themes/tweme/css/style.css': 'scss/styles.scss'       // 'destination': 'source
                }
            }
        },
        
         bake: {
            your_target: {
                options: {
                    parsePattern: /\[\[\s*([^\}]+)\s*\]\]/g,
                },

                files: {
                    // files go here, like so:
                    "../themes/tweme/templates/page.html.twig": "_templates/page.html.twig",
                    "../themes/tweme/templates/page--foto.html.twig": "_templates/page--foto.html.twig"
                }
            },
        },
        

        watch: {
            grunt: {
                files: ['Gruntfile.js']
            },
            
            
             bake: {
                files: [
                    '_templates/**/*.twig'
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
              map: true,
              processors: [
                require('autoprefixer')({browsers: ['last 2 versions', 'ie 10']}),
              ]
            },
            dist: {
              src: '../themes/tweme/css/style.css'
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
