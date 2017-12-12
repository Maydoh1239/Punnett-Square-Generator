from colorsys import hls_to_rgb as hr
from random import random as randf
from PIL import Image,ImageDraw,ImageFont
import os
location = os.path.dirname(os.path.abspath(__file__))


def frange(start, end=None, inc=None):
    "A range function, that does accept float increments..."

    if end == None:
        end = start + 0.0
        start = 0.0

    if inc == None:
        inc = 1.0

    L = []
    while 1:
        next = start + len(L) * inc
        if inc > 0 and next >= end:
            break
        elif inc < 0 and next <= end:
            break
        L.append(next)
        
    return L


def getcolor(s):
    l = [s[i:i+2] for i in range(0, len(s),2)]
    st=''
    for i in range(0,len(l)):
        a =l[i]
        if a==a.lower():
            st+='0'
        else:
            st+='1'
    return tuple(list(map(lambda x:round(255*x),hr(int(st,2)/len(r),0.5,1.0)))+[100])

while True:
    let=input("parents(separate with a dash):").split('-')

    bins=list()
    for i in range (0,2**int(len(let[0])/2)):
        bins.append(format(i, '0'+str(int(len(let[0])/2))+'b'))

    c = []
    r = []
    for i in bins:
        s1=""
        s2=""
        for a in range(0,len(i)):
            s1+=(let[0][2*a+int(i[a])])
            s2+=(let[1][2*a+int(i[a])])
        c.append(s1)
        r.append(s2)

    mult=2
    sqsize=mult*((6*len(let[0]))+6)

    img=Image.new('RGBA',((len(r)+1)*(sqsize+1)+1,(len(c)+1)*(sqsize+1)+1))
    d=ImageDraw.Draw(img)
    w,h=img.size
    d.rectangle((sqsize+1,sqsize+1,w,h),fill=(0,0,0))
    for i in range(0,len(c)+1):
        row=[]
        for j in range(0,len(r)+1):
            if i==0 and j==0:
                pass
            elif i==0:
                p=c[j-1]
                d.text((i*(sqsize+1)+1+sqsize/2-3*mult*len(p),j*(sqsize+1)+1+sqsize/2-5*mult),p,fill=(0,0,0),font=ImageFont.truetype("/Library/Fonts/Courier New.ttf", 10*mult),spacing=0)
            elif j==0:
                p=r[i-1]
                d.text((i*(sqsize+1)+1+sqsize/2-3*mult*len(p),j*(sqsize+1)+1+sqsize/2-5*mult),p,fill=(0,0,0),font=ImageFont.truetype("/Library/Fonts/Courier New.ttf", 10*mult),spacing=0)
            else:
                p=''.join(sorted(r[j-1]+c[i-1], key=lambda s: ord(s.lower())*2+(1 if s.lower()==s else 0)))
                q = getcolor(p)
                d.rectangle((i*(sqsize+1)+1,j*(sqsize+1)+1,i*(sqsize+1)+sqsize,j*(sqsize+1)+sqsize),fill=q)
                d.text((i*(sqsize+1)+1+3*mult,j*(sqsize+1)+1+sqsize/2-5*mult),p,fill=(0,0,0),font=ImageFont.truetype("/Library/Fonts/Courier New.ttf", 10*mult),spacing=0)

    minicap=[7424, 665, 7428, 7429, 7431, 1171, 610, 668, 618, 7434, 7435, 671, 7437, 628, 7439, 7448, 491, 640, 115, 7451, 7452, 7456, 7457, 120, 655, 7458]

    img.show()
    img.save(location+'/Example Squares/'+str(int(len(let[0])/2))+'_'+(''.join(list((a if ord(a)<97 else chr(minicap[ord(a)-97])) for a in let[0]))+' - '+''.join(list((a if ord(a)<97 else chr(minicap[ord(a)-97])) for a in let[1])))+'.png')
