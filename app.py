from flask import Flask, redirect, render_template, session, request, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()
guess_dict = {}

@app.route('/begin', methods=["POST"])
def create_gameboard():
    """Creating a post request that makes a board and stores it in a session"""
    session["GAME"] = boggle_game.make_board() 
    return redirect ('/game')

@app.route('/')
def homepage():
    """Start page"""
    return render_template('start.html')

@app.route('/game')
def start_game():
    game_list = session["GAME"] 
    return render_template("game.html", gameboard = game_list)    

@app.route('/game/check', methods=["POST"])
def check():
    """When you submit it will check if the word is involved in the dictionary"""
    guess = request.json
    print(f"{guess['words']}......json object......score...... {guess['scores']}")
    guess_str = ("").join(guess['words'])
    guess_lower = guess_str.lower()
    session['SCORE']= guess['scores']
    print(session['SCORE'])
    board = session["GAME"]
    result = boggle_game.check_valid_word(board, guess_lower)
    print(result)
    session["json_results"] = {"result" : result}
    return redirect ('/game')

@app.route('/game/json')
def create_json():
    sesh_result = session["json_results"]
    print(sesh_result)
    return jsonify(sesh_result)

