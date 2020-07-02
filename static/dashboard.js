//retrieves file names and makes tiles
document.body.onload = function()
{
  req = $.ajax({
      url : '/query',
      type: 'POST',
    });

  req.done(function(data){
    window.base_data = data;
    search();
    });
}

//Logout
document.getElementById("logout").addEventListener("click",
function()
{
  window.location = "/logout";
});

//renders tiles with a link to download
function render_tiles(data, img_links)
{
  document.getElementById('search_results').textContent = '';
  //repeat for every file that matches query. Image is provided by img_links
  for (file in data)
  {
    //background of tile
    var tile = document.createElement('div');
    tile.className = "tile";

    //Where the file download link goes
    var topbar = document.createElement('div');
    topbar.className = "bar";

    //download link
    var download = document.createElement('a');
    download.href =  "/download/"+data[file].filename;
    download.textContent = data[file].filename;
    download.className = 'tile_content';

    //img in middle of tile
    var img = document.createElement('img');
    img.src = img_links[file];
    img.className = 'tile_img';

    //Where the delete link goes
    var botbar = document.createElement('div');
    botbar.className = "bar";

    //link to delete file from database
    var remove = document.createElement('a');
    remove.className='tile_content';
    remove.href =  "/delete/"+data[file]._id;
    remove.textContent = "Delete";



    //stitch elements to each other
    document.getElementById('search_results').appendChild(tile);
    tile.appendChild(topbar);
    topbar.appendChild(download);
    tile.appendChild(img);
    tile.appendChild(botbar)
    botbar.appendChild(remove);
  }
}

//Creates filters to which images are added. More images can be added. Copy paste and add to the list of vars
function generate_classification()
{
  window.img_list = [];
  var python_search =  [RegExp('^.*\.py$','gm'),'/static/python.png'];
  img_list.push(python_search);

  var javascript_search = [RegExp('^.*\.js$','gm'),'/static/javascript.png'];
  img_list.push(javascript_search);

  var cpp_search = [RegExp('^.*\.cpp$','gm'),'/static/cpp.png'];
  img_list.push(cpp_search);

  var html_search = [RegExp('^.*\.html$','gm'),'/static/html.png'];
  img_list.push(html_search);

  var css_search = [RegExp('^.*\.css$','gm'),'/static/css.png'];
  img_list.push(css_search);
}
//Run function
generate_classification();

//escape keys query string.
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

//Checks if filename matches query. If it does, assign a file type if possible
function search()
{
  //list of valid matches
  temp_data = [];
  //escape key the query
  var query = escapeRegExp(document.getElementById("search-bar").value);
  //list of images to be sent
  var img_links = [];
  // repeat for every filename
  for (index in base_data)
  {
    //RegEx searches for filenames that have query in it. Case insensitive
    var basic_search = RegExp('.*'+query+'.*','gi');
    if(basic_search.test(base_data[index].filename))
    {
      //assume unkown file type
      img_links.push('/static/base.png');
      temp_data.push(base_data[index]);
      //check if any filter matches
      for (jindex in img_list)
      {
        //if match switch the img to the appropriate one
        if(window.img_list[jindex][0].test(base_data[index].filename))
        {
          img_links.pop();
          img_links.push(window.img_list[jindex][1])
        }
      }
    }
  }
  render_tiles(temp_data,img_links);
}


//Updates tiles when typing in search bar
document.getElementById("search-bar").addEventListener("keyup",function(){search();});


//Sends file data after file is selected
document.getElementById("file").addEventListener("input",
  function() {
    document.getElementById('submitForm').submit();
  }
);
