from reportlab.platypus import Table
from reportlab.lib import colors
def footertable(widths,heights,i):
    widthlist=[
        
        widths*15/100,
        widths*55/100,
        widths*12/100,
        
    ]
    text1="RedTeam Security"
    text2="ACME Corporation"
    pageno=str(i)+" of "+"4"
    
    
    res=Table([
        [text1,pageno,text2]
    ],widthlist,heights)
    color=colors.toColor('rgba(0,0,0,0.5)')
    res.setStyle([
    #('GRID',(0,0),(-1,-1),1,'red'),
    
    #('BACKGROUND',(0,0),(-1,-1),COLOUR),
    #('TEXTCOLOR',(0,0),(-1,-1),'white'),
    ('ALIGN',(0,0),(0,0),'LEFT'),
    ('ALIGN',(1,0),(1,0),'CENTRE'),
    ('ALIGN',(2,0),(2,0),'RIGHT'),

    ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
    ('BOTTOMPADDING',(0,0),(-1,-1),5),
    ('RIGHTPADDING',(0,0),(0,0),5),
    ('FONTNAME',(0,0),(-1,-1),'caliber'),
    ('FONTSIZE',(0,0),(-1,-1),10),
    ('TEXTCOLOR',(0,0),(-1,-1),color)
    ])
    return res
