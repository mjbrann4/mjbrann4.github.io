import pandas as pd
import numpy as np
import os

wd = os.getcwd()
print(os.listdir(wd))

file = 'mn_data_pull.xlsx'

xl = pd.read_excel(file, sheetname=None)
print(xl.keys())

print(xl['county_decile'].head())
print(xl['county_hh'].head())

df = pd.concat([xl['county_decile'],xl['county_hh']]).reset_index(drop=True)

print(df.shape)
print(df.head())

# variable for farm county
farm_counties = [27121, 27141, 27171, 27103, 27147, 27079, 27043, 27163]

df['farm_flag'] = np.where(df['county_fips'].isin(farm_counties), 1, 0)

df['farm_name'] = df['county_fips'].map({27121: 'Bartlett',
                                        27141: 'Tjfarms',
                                        27171: 'Thesis',
                                        27103: 'Vetter',
                                        27147: 'Brase',
                                        27079: 'Gregor',
                                        27043: 'Mnlake',
                                        27163: 'Mchattie'})

df['farm_name'] = df['farm_name'].fillna('NA')
 
#clean up 
#--------------------------

# drop overall rows for homeowner
df = df.drop(df[(df.group_label == 'homeowner') & (df.group_value == -99)].index)

# rename group label as all
df.loc[df.group_value == -99, 'group_label'] = 'all'    

df.to_csv('mn_farms.csv', index=False)

