
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 's6-voice' });
};