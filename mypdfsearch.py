#criado por Beatriz Brito e Alan Ramalho
#03032024

import sys
import aspose.words as aw

file = sys.argv[1]

pdf = aw.Document(file)
pdf.save('file.docx')