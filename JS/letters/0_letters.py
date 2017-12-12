from PIL import Image,ImageDraw,ImageFont
import string
import os
location = os.path.dirname(os.path.abspath(__file__))

for a in string.ascii_lowercase+string.ascii_uppercase:
    mult=25
    im = Image.new('RGBA',(6*mult,10*mult))
    ImageDraw.Draw(im).text((0,0),a,fill=(0,0,0),font=ImageFont.truetype("/Library/Fonts/Courier New.ttf", 10*mult),spacing=0)
    im.save(location+"/"+('1' if a ==a.upper() else '0')+a+".png")
