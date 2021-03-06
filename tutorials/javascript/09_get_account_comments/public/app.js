const dhive = require('@hiveio/dhive');
let opts = {};
//connect to production server
opts.addressPrefix = 'STM';
opts.chainId =
    'beeab0de00000000000000000000000000000000000000000000000000000000';
//connect to server which is connected to the network/production
const client = new dhive.Client('https://api.hive.blog');

const Remarkable = require('remarkable');
const md = new Remarkable({ html: true, linkify: true });

//fetch list of comments for certain account
async function main() {
    const author = prompt('Account?', 'hiveio');
    
    client.hivemind
        .call('get_account_posts', {sort: 'comments', account: author, limit: 100})
        .then(result => {
            console.log(result);
            if (
                !(
                    Object.keys(result).length === 0 &&
                    result.constructor === Object
                )
            ) {
                var comments = [];
                Object.keys(result).forEach(key => {
                    const comment = result[key];
                    const parent_author = comment.parent_author;
                    const parent_permlink = comment.parent_permlink;
                    const created = new Date(comment.created).toDateString();
                    const body = md.render(comment.body);
                    const totalVotes = comment.stats.total_votes;
                    comments.push(
                        `<div class="list-group-item list-group-item-action flex-column align-items-start">\
                        <div class="d-flex w-100 justify-content-between">\
                          <h6 class="mb-1">@${comment.author}</h6>\
                          <small class="text-muted">${created}</small>\
                        </div>\
                        <p class="mb-1">${body}</p>\
                        <small class="text-muted">&#9650; ${totalVotes}, Replied to: @${parent_author}/${parent_permlink}</small>\
                      </div>`
                    );
                });
                document.getElementById('author').innerHTML = author;
                document.getElementById('comments').style.display = 'block';
                document.getElementById('comments').innerHTML = comments.join(
                    ''
                );
            }
        })
        .catch(err => {
            console.log(err);
            alert('Error occured, please reload the page');
        });
}
//catch error messages
main().catch(console.error);
