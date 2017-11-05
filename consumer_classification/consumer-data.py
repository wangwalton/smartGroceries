
import numpy as np
import pandas as pd
from sklearn.cluster import MeanShift
import matplotlib.pyplot as plt
from matplotlib import style
style.use("ggplot")
from mpl_toolkits.mplot3d import Axes3D
from sklearn import decomposition

df = pd.read_csv('data/consumer_data.csv')
df = df.drop(['Channel', 'Region'], axis=1)

# ANALYSIS
ms = MeanShift()
ms.fit(df)
labels = ms.labels_
cluster_centers = ms.cluster_centers_
print(cluster_centers)
n_clusters_ = len(np.unique(labels))
print("Number of estimated clusters:", n_clusters_)


# In[28]:
df_normalized = df.divide(df.sum(axis=1), axis=0)

# In[31]:
ms_n = MeanShift()
ms_n.fit(df_normalized)
labels_n = ms_n.labels_
cluster_centers_n = ms_n.cluster_centers_
print(cluster_centers_n)
n_clusters_n = len(np.unique(labels_n))
print("Number of estimated clusters:", n_clusters_n)

# In[77]:
fig = plt.figure(1, figsize=(12, 9))
plt.clf()

plt.cla()
pca = decomposition.PCA(n_components=2)
pca.fit(df)
df = pca.transform(df)

plt.scatter(df[:,0], df[:,1])
plt.show()

