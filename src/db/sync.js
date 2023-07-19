/**
 * @description sync all tables
 */

const seq = require('./seq');

require('./model/Index');

// test connection
seq.authenticate().then(() => {
    console.log('ok');
}
).catch(() => {
    console.log('err');
}
)

// execute sync
seq.sync({ force: true }).then(() => {
    console.log('sync ok');
    process.exit();
}
)
