from reportlab.platypus import Table,Image
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase.ttfonts import TTFont

from reportlab.pdfbase import pdfmetrics

import os
def Output():
    output_div=r"D:\Downloads\s.pdf"
    return output_div
def table():
    width,height=A4
    
    return width,height,A4
def font():
    pdfmetrics.registerFont(
        
   
        TTFont('caliber',r"D:\Downloads\Calibri.ttf")
    )
    pdfmetrics.registerFont(
   
        TTFont('caliber-bold',r"D:\Downloads\CALIBRIB.TTF")
    )
def image():
    return r"https://img1.wsimg.com/isteam/ip/f5246092-6632-43f4-aff3-382105966beb/s3infosoft_logo.png/:/rs=w:469,h:75,cg:true,m/cr=w:469,h:75/qt=q:100/ll"

