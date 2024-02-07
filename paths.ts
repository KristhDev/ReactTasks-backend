import moduleAlias from 'module-alias';

moduleAlias.addAliases({
    '@server': __dirname + '/src/server',
    '@database': __dirname + '/src/database',
    '@auth': __dirname + '/src/modules/auth',
    '@images': __dirname + '/src/modules/images',
    '@tasks': __dirname + '/src/modules/tasks'
});

moduleAlias();