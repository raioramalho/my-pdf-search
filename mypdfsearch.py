#criado por Beatriz Brito e Alan Ramalho
#03032024

import sys
#import aspose.words as aw
from pdf2docx import Converter

file = sys.argv[1]

cv = Converter(file)
cv.convert('./file.docx')
# pdf = aw.Document(file)
# pdf.save('file.docx')