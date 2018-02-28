/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//Storing the highlighted square (-1 means no square is highlighted
var highlightedx = -1;
var highlightedy = -1;
var score = 0;
var layout;
main();
function main()
{
    layout = scramble();
    while(checkMatches()[1])
    {
        layout = scramble();
    }
    refreshBoard();
    document.addEventListener('DOMContentLoaded', addListeners());
    var scoreBoard = checkMatches()[0];
    for(var x = 0; x < scoreBoard.length; x++)
    {
        for(var y = 0; y < scoreBoard[x].length; y++)
        {
            if(scoreBoard[x][y]==1)
            {
                document.getElementById((x+1) + "" + (y+1)).style.borderColor = "green";
            }
        }
    }
    //    document.getElementById("score").innerHTML = "Score = " + score;
}
//Add the onclick listeners
//Local scope used to keep the tiles variable
function addListeners()
{
    var tiles = document.getElementsByClassName("Tile");
    var x;
    var y;
    for(var i = 0; i < tiles.length; i++)
    {

        x = tiles[i].id.charAt(0);
        y = tiles[i].id.charAt(1);
        tiles[i].onclick = (function(x,y)
        {
            return function() {highlight(x,y)};
        })(x, y);
    }
}
function highlight(x, y)
{
    //Do nothing if the square selected is invalid
    if (x < 0 || x > 5)
    {
        return;
    }
    if (y < 0 || y > 5)
    {
        return;
    }
    //They should both be set but it's just safe to be sure
    if (highlightedx == -1 || highlightedy == -1)
    {
        //store the selections
        highlightedx = x;
        highlightedy = y;
        //Show the highlighted border
        document.getElementById(x + "" + y).style.borderColor = "yellow";
    }
    else
    {

        //They just clicked the same square twice deselect it
        if(x == highlightedx && y == highlightedy)
        {
            highlightedx = -1;
            highlightedy = -1;
            document.getElementById(x+""+y).style.borderColor="white";
            return;
        }
        //Check to see if the two squares are adjascent
        if((x == highlightedx &&
                y - highlightedy == 1 || y- highlightedy == -1) ||
            y == highlightedy &&
                x - highlightedx == 1 || x - highlightedx == -1)
        {
            if(checkMove(x,y,highlightedx,highlightedy))
            {
                swapCascade(x,y,highlightedx,highlightedy);
                document.getElementById(highlightedx+""+highlightedy).style.borderColor="white";
                highlightedx = -1;
                highlightedy = -1;
                refreshBoard();
                
            }
            else //do the flashing red animation
            {
                var oldTile = document.getElementById(highlightedx + "" + highlightedy);
                var newTile = document.getElementById(x + "" + y);
                highlightedx = -1;
                highlightedy = -1;
                //flash 3 times
                var isRed = false;
                //flashing animation
                var myInterval = setInterval(function(){
                if(isRed)
                {
                    oldTile.style.borderColor = "white";
                    newTile.style.borderColor = "white";
                }
                else
                {
                    oldTile.style.borderColor = "red";
                    newTile.style.borderColor = "red";
                }
                isRed = !isRed;
            }, 100);
            //exit the animation and reset borders to white
            setTimeout(function()
            {
                clearInterval(myInterval);
                oldTile.style.borderColor = "white";
                newTile.style.borderColor = "white";
            },500);
                
            }
            
        }
        else //The two squares are not adjascent
        {
            //store these so the animation doesn't interfere with user input
            var oldTile = document.getElementById(highlightedx + "" + highlightedy);
            var newTile = document.getElementById(x + "" + y);
            highlightedx = -1;
            highlightedy = -1;
            //flash for .5 seconds
            var isRed = false;
            //flashing animation
            var myInterval = setInterval(function(){
                if(isRed)
                {
                    oldTile.style.borderColor = "white";
                    newTile.style.borderColor = "white";
                }
                else
                {
                    oldTile.style.borderColor = "red";
                    newTile.style.borderColor = "red";
                }
                isRed = !isRed;
            }, 100);
            //exit the animation and reset borders to white
            setTimeout(function()
            {
                clearInterval(myInterval);
                oldTile.style.borderColor = "white";
                newTile.style.borderColor = "white";
            },500);

        }
        
    }
    refreshBoard();
}
function scramble()
{
    var boardLayout = [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]];
    for(var x = 0; x < boardLayout.length; x++)
    {
        for(var y = 0; y < boardLayout[x].length; y++)
        {
            boardLayout[x][y] = Math.floor(Math.random()*4 + 1);
        }
    }
    return boardLayout;
}
//Returns an array containing
//1. An array specifying the location of the matches (1 is a match)
//2. A boolean specifying whether a match was found
//3. The amount of score gained from the board
function checkMatches()
{
    //Saves the loactions of the mathed tiles
    var boardLayout = [[0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]];
    //Decides if there are matching tiles
    var result = false;
    //Score to be gained from this field
    var scoreGain = 0;
    //Check vertical mathces
    for(var x = 0; x < layout.length; x++)
    {
        var streak = 1;
        var current = layout[x][0];
        for(var y = 1; y < layout[x].length; y++)
        {
            if(layout[x][y] == current)
            {
                streak++;
                //The second check is just to be safe
                if(streak >= 3)
                {
                    result = true;
                    //Save the matching tiles
                    for(var index = 0; index < streak; index++)
                    {
                        boardLayout[x][y -index] = 1;
                    }
                    scoreGain += streak;
                }
            }
            else
            {
                //reset the streak
                current = layout[x][y];
                streak = 1;
            }
        }
    }
    //Check horizontal matches
    for(var y = 0; y < boardLayout[0].length; y++)
    {
        var streak = 1;
        var current = layout[0][y];
        for(var x = 1; x < boardLayout.length; x++)
        {
            if(layout[x][y] == current)
            {
                streak++;
                //The second check is just to be safe
                if(streak >= 3)
                {
                    result = true;
                    //Save the matching tiles
                    for(var index = 0; index < streak; index++)
                    {
                        boardLayout[x - index][y] = 1;
                    }
                    scoreGain += streak;
                }
            }
            else
            {
                //reset the streak
                current = layout[x][y];
                streak = 1;
            }
        }
    }
    return [boardLayout, result, scoreGain];
}
function checkMove(x1, y1, x2, y2)
{
    //out of bounds check
    if(x1 < 0 || x1 > 5 || y1 < 0 || y1 > 5 || x2 < 0 || x2 > 5 || y2 < 0 || y2 > 5)
    {
        return false;
    }
    //Save a copy of the board as backup
    var temp = layout[x1][y1];
    layout[x1][y1]=layout[x2][y2];
    layout[x2][y2]=temp;
    if(checkMatches()[1])
    {
        var temp = layout[x1][y1];
        layout[x1][y1]=layout[x2][y2];
        layout[x2][y2]=temp;
        return true;
    }
    else
    {
        var temp = layout[x1][y1];
        layout[x1][y1]=layout[x2][y2];
        layout[x2][y2]=temp;
        return false;
    }
}
function swapCascade(x1,y1,x2,y2)
{
    //Swap the 2 tiles
    var temp = layout[x1][y1];
    layout[x1][y1] = layout[x2][y2];
    layout[x2][y2]=temp;
    cleanMatches();
    refreshBoard();
    var refreshThread = setInterval(
            function()
    {
        if(!cascadeTiles())
        {
            //All tiles have fallen down
            if(!cleanMatches())
            {
                refreshBoard();
                clearInterval(refreshThread);
            }
        }
        refreshBoard();
    },300);
}
//Displays the board based on the current values in the layout array
function refreshBoard()
{
    for(var x = 0; x < layout.length; x++)
    {
        for(var y = 0; y < layout[x].length; y++)
        {
            if(layout[x][y] == 1)
            {
                document.getElementById(x + "" +y).style.backgroundColor = "red";
            }
            else if(layout[x][y] == 2)
            {
                document.getElementById(x + "" +y).style.backgroundColor = "yellow";
            }
            else if(layout[x][y] == 3)
            {
                document.getElementById(x + "" +y).style.backgroundColor = "lime";
            }
            else if(layout[x][y] == 4)
            {
                document.getElementById(x + "" +y).style.backgroundColor = "blue";
            }
            else
            {
                document.getElementById(x + "" +y).style.backgroundColor = "white";
            }
        }
    }
    document.getElementById("score").innerHTML = "Score = " + score;
 
}

function cleanMatches()
{
    var matches = checkMatches();
    if(matches[1])
    {
        console.log("Found a match");
        score += matches[2]
        for(var y = 0; y < layout.length; y++)
        {
            for(var x = 0; x < layout[0].length; x++)
            {
                if(matches[0][x][y]==1)
                {
                    layout[x][y] = 0;
                }
            }
        }
    }
    return matches[1];
}
function cascadeTiles()
{
    //determines if a cascade actually occured
    var result = false;
    for(var x = 0; x < layout.length; x++)
    {
        for(var y = layout[x].length - 1; y >= 0; y--)
        {
            //Empty space found
            if(layout[x][y] == 0)
            {
                result = true;
                //Top of the board-pick a random color
                if(x == 0)
                {
                    layout[x][y] = Math.floor(Math.random()*4 + 1);
                }
                else
                {
                    //Move one down
                    layout[x][y] = layout[x-1][y];
                    //make empty space
                    layout[x-1][y] = 0;
                }
            }
        }
    }
    return result;
}
    
