from django import forms

class WordForm(forms.Form):
    word = forms.CharField(max_length=100)
