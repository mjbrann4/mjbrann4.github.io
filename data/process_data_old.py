import pandas as pd 
import os

wd = os.getcwd()
print(os.listdir(wd))

df_2015 = pd.read_csv('OD_2015.csv', 
	usecols=['State','Rate','Number']) 

df_2014 = pd.read_csv('OD_2013_2014.csv', 
	usecols=['State', '2014Rate', '2014Number'])

df_2013 = pd.read_csv('OD_2013_2014.csv', 
	usecols=['State', '2013Rate', '2013Number'])

#put dataframes into a list
df_list = [df_2013, df_2014, df_2015]
df_list_clean = []

for index, df in enumerate(df_list):
	print(df.head())
	df.columns = ['state','rate','num_deaths']
	print(df.head())

    #drop missing rows
	df = df.dropna()

	#set year
	df['year'] = 2013 + index

	#append clean df to new list - warning seems fine
	df_list_clean.append(df)

assert df_list_clean[0].shape == df_list_clean[1].shape == df_list_clean[2].shape 

#concatenate into one clean dataframe
df_final = pd.concat(df_list_clean)

#write to csv
df_final.to_csv('../OD_data.csv', index=False)





    