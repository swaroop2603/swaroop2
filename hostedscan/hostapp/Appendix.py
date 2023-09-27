from reportlab.platypus import Table,Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
def appendix(widths,heights):
    widthlist = [
        widths * 5 / 100,
        widths * 90 / 100,
        widths * 5 / 100
    ]
    heightlist=[
        heights * 8 / 100,
        heights * 3 / 100,
        heights * 3 / 100,
        heights * 3 / 100,
        heights*83/100,

    ]
    res = Table([
        [page5text1(widthlist[1],heightlist[0])],
        [''],
        [page5text2(widthlist[1],heightlist[2])],
        [''],
        [page5text3(widthlist[1],heightlist[4])],
    ], widthlist[1], heightlist)
    return res
def page5text1(widths,heights):
    text="Appendix A"
    res=Table([
        [text]
    ],widths,heights)
    color=colors.HexColor('#87CEEB')
    res.setStyle([
        ('TEXTCOLOR',(0,0),(-1,-1),'white'),
        ('FONTNAME',(0,0),(-1,-1),'Helvetica'),
        ('FONTSIZE',(0,0),(-1,-1),20),
        ('BACKGROUND',(0,0),(0,0),color),
        ('BOTTOMPADDING',(0,0),(-1,-1),30)

    ])
    return res
def page5text2(widths,heights):
    text="Approach"
    res=Table([
        [text]
    ],widths,heights)
    color=colors.HexColor("#89CFF0")
    res.setStyle([
        ('TEXTCOLOR',(0,0),(-1,-1),color),
        ('FONTNAME',(0,0),(-1,-1),'caliber'),
        ('FONTSIZE',(0,0),(-1,-1),20),
    ])
    return res
def page5text3(widths,heights):
    text1="""RedTeam Security's network penetration test combines the results from industry-leading 
    scanning tools with manual testing to enumerate and validate vulnerabilities, configuration errors,
     and business logic flaws. Indepth manual application testing enables us to find what scanners often miss."""
    text2="""Web applications are particularly vulnerable to external attack given that they are inherently 
    designed to be accessible to the Internet. While automated scanners check for known vulnerabilities, 
    they are incapable of actually reporting on real business risk. Our web application security testing helps you lower your risk of data
    breach, improve productivity, protect your brand, and maximize the ROI from your web applications."""
    text3="""RedTeam Security's network penetration test service utilizes a risk-based approach to manually identify critical application-centric 
    vulnerabilities that exist on all in-scope applications."""
    text4="""Using this approach, RedTeam's comprehensive approach covers the classes of vulnerabilities in the Open
     Web Application Security Project (OWASP) Top 10 2013 and beyond:"""
    text5="1.Injection (i.e.: SQL injection)"
    text6="2.Broken Authentication and Session Management"
    text7 = "3.Cross-site Scripting (XSS)"
    text8 = "4.Insecure Direct Object Access"
    text9 = "5.Security Misconfiguration"
    text10 = "6.Sensitive Data Exposure"
    text11 = "7.Missing Function Level Access Control"
    text12 = "8.Cross-site Request Forgery (CSRF)"
    text13 = "9.Using Components with Known Vulnerabilities"
    text14 = "10.Unvalidated Redirects and Forwards"
    text15="Automated vs Manual Testing"
    text16="""RedTeam's approach consists of about 80% manual testing and about 20% automated testing - actual 
    results may vary slightly. While automated testing enables efficiency, it is effective in providing efficiency 
    only during the initial phases of a penetration test. At RedTeam Security, it is our belief that an effective 
    and comprehensive test can only be realized through rigorous manual testing techniques"""
    text17="Tools"
    text18="""In order to perform a comprehensive real-world assessment, RedTeam Security utilizes commercial tools, 
    internally developed tools and the same tools that hacker use on each and every assessment. Once again, our intent
     is to assess systems by simulating a real-world attack and we leverage the many tools at our disposal to effectively carry out that task."""
    text19="We make use of tools from the following categories (not a complete list):"
    text20="1.Commercial tools (i.e.: Burp Suite Pro, AppScan, WebInspect)"
    text21="2.Open source / Hacker tools (i.e.: Metasploit, BEeF, Kali Linux, OWASP Zap)"
    text22="3.RedTeam developed tools (i.e.: nmapcli, Metasploit modules, PlugBot, various scripts)"
    para1style = ParagraphStyle('st')
    para1style.fontName = 'caliber'
    para1style.fontSize = 12
    para1style.spaceAfter = 10
    para2style = ParagraphStyle('st')
    para2style.fontName = 'caliber-bold'
    para2style.fontSize = 12
    para2style.spaceAfter = 10
    bullet_style = ParagraphStyle(name="BulletStyle", leftIndent=20, bulletIndent=10, bulletFontSize=12)
    bullet_style.fontSize=12
    bullet_style.fontName = 'caliber'
    para1 = Paragraph(text1, para1style)
    para2 = Paragraph(text2, para1style)
    para3 = Paragraph(text3, para1style)
    para4=Paragraph(text4,para1style)


    para5 = Paragraph(text5, bullet_style)
    para6 = Paragraph(text6, bullet_style)
    para7 = Paragraph(text7, bullet_style)
    para8 = Paragraph(text8, bullet_style)
    para9 = Paragraph(text9, bullet_style)
    para10 = Paragraph(text10, bullet_style)
    para11 = Paragraph(text11, bullet_style)
    para12 = Paragraph(text12, bullet_style)
    para13 = Paragraph(text13, bullet_style)
    para14 = Paragraph(text14, bullet_style)
    para15=Paragraph(text15,para2style)
    para16=Paragraph(text16,para1style)
    para17=Paragraph(text17,para2style)
    para18=Paragraph(text18,para1style)
    para19=Paragraph(text19,para1style)
    para20 = Paragraph(text20, bullet_style)
    para21 = Paragraph(text21, bullet_style)
    para22 = Paragraph(text22, bullet_style)
    paralist=[]
    paralist.append(para1)
    paralist.append(para2)
    paralist.append(para3)
    paralist.append(para4)

    paralist.append(para5)
    paralist.append(para6)
    paralist.append(para7)
    paralist.append(para8)
    paralist.append(para9)
    paralist.append(para10)
    paralist.append(para11)
    paralist.append(para12)
    paralist.append(para13)
    paralist.append(para14)
    paralist.append(Paragraph("",para1style))
    paralist.append(para15)
    paralist.append(para16)
    paralist.append(para17)
    paralist.append(para18)
    paralist.append(para19)
    paralist.append(para20)
    paralist.append(para21)
    paralist.append(para22)




    res=Table([
        [paralist]

    ],widths,heights)
    return res