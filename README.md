# Intro

This repo was inspired by https://www.youtube.com/watch?v=nmgFG7PUHfo (The Algorithm That Transformed The World). After
watching I tried to find out if it was true that the Fourier Transform could lead to data compression. 
However I learned that instead two dimensional discrete cosine transform was used for JPEG, movies and pictures due to the fact
that it was easier to implement and so I decided to do it instead with DCT. 

I read what was available on Wikipedia, StackOverflow, Geeks2Geeks etc. several times and finally I even simplified the code and 
dropped quantification as used in JPEG. I am still curious whether or not a simple one dimensional DCT would do. 

# Issues

Just trying to read a simple picture ended up in CORS warnings and so I packed the picture file in a js file in a variable instead
in base64. 