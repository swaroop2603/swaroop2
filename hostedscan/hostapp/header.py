from reportlab.platypus import Table,Image,Paragraph
from reportlab.lib import colors
from .localsettings import font,table,image
from reportlab.lib.styles import ParagraphStyle
def headertable(width,height,i):
    if i==1:
        widthlist=[
        
        width*40/100,
        width*20/100,
        width*20/100,
        
            ]
     
        img=Image(image(),widthlist[0]-25,height-25,kind='proportional')
        
        res=Table([
            [],
            [img]
            ],widthlist,height)
        res.setStyle([
            #('GRID',(0,0),(-1,-1),1,'red')
            ('INNERGRID', (0, 1), (3, 1), 1, colors.black),

            #('ALIGN',(1,0),(-1,-1),'LEFT'),
            #('VALIGN',(2,0),(-1,-1),'MIDDLE'),
            #('LEFTPADDING',(2,1),(-1,-1),60)
            ])
        return res
    else:
        widthlist=[
        
        width*40/100,
        width*40/100,
        
            ]
      
        img=Image(image(),widthlist[0]-35,height-35,kind='proportional')
        
        res=Table([
            
            [img],
            ],widthlist,height)
        res.setStyle(
            [
                #('GRID',(0,0),(-1,-1),1,'red'),
                #('ALIGN',(1,2),(-1,-1),'RIGHT'),
                #('VALIGN',(2,1),(-1,-1),'MIDDLE'),
                #('LEFTPADDING',(2,1),(-1,-1),60)
                ('BOTTOMPADDING',(0,0),(-1,-1),40)
            ]
        )
        return res


    
