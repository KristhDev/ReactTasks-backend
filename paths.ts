import moduleAlias from 'module-alias';

moduleAlias.addAliases({
    '@auth': __dirname + '/src/modules/auth',
    '@database': __dirname + '/src/database',
    '@images': __dirname + '/src/modules/images',
    '@package': __dirname + '/package.json',
    '@server': __dirname + '/src/server',
    '@tasks': __dirname + '/src/modules/tasks'
});

moduleAlias();