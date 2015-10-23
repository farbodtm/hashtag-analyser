package hashtag;

import org.apache.commons.math3.linear.*;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class KSCClustering {
    public List<Hashtag> hashtags;
    public List<Hashtag> centroids;

    public KSCClustering(List<Hashtag> hts) {
        hashtags = new ArrayList<>(hts);
    }


    public void run(int numCluster) {
        createClusters(numCluster);
        // assign each hashtag to a random cluster
        for (Hashtag hashtag : hashtags) {
            hashtag.cluster = ThreadLocalRandom.current().nextInt(0, numCluster);
        }
        List<Integer> mem = new ArrayList<>();
        for (Hashtag hashtag : hashtags) {
            mem.add(hashtag.cluster);
        }

        for(int i = 0; i < 200; i++) {
            // Refinement
            for (int j = 0; j < centroids.size(); j++) {
                computeCentral(j);
            }
            // Assignment
            for (Hashtag hashtag : hashtags) {
                int minCluster = 0;
                double minDist = computeDistance(centroids.get(0), hashtag).value;
                for (int j = 1; j < centroids.size(); j++) {
                    Hashtag cluster = centroids.get(j);
                    Distance dist = computeDistance(cluster, hashtag);
                    if (dist.value < minDist) {
                        minDist = dist.value;
                        minCluster = j;
                    }
                }
                hashtag.cluster = minCluster;
            }

            List<Integer> new_mem = new ArrayList<>();
            for (Hashtag hashtag : hashtags) {
                new_mem.add(hashtag.cluster);
            }
            if (mem.equals(new_mem)) {
                System.out.println(i);
                break;
            }
        }
    }

    public void computeCentral(int k) {
        Hashtag currentCenter = centroids.get(k);
        List<List<Double>> cluster = new ArrayList<>();

        for (int i = 0; i < hashtags.size(); i++) {
            Hashtag hashtag = hashtags.get(i);
            if (hashtag.cluster == k) {
                if (sum(currentCenter.temporal) == 0) {
                    cluster.add(hashtag.temporal);
                } else {
                    Distance distance = computeDistance(currentCenter, hashtag);
                    cluster.add(distance.shiftedTemporal);
                }
            }
        }

        if (cluster.size() == 0) {
            currentCenter.temporal = new ArrayList<Double>(Collections.nCopies(hashtags.get(0).temporal.size(), 0d));
            centroids.set(k, currentCenter);
        }

        // calculate x/norm(x)
        for (int i = 0; i < cluster.size(); i++) {
            List<Double> a = cluster.get(i);
            double norm = 0;
            for (int j = 0; j < a.size(); j++) {
                norm += Math.pow(a.get(j), 2);
            }
            norm = Math.sqrt(norm);
            for (int j = 0; j < a.size(); j++) {
                a.set(j, a.get(j)/norm);
            }
        }
        // create a matrix of with all the hashtags
        double[][] matrixData = new double[cluster.size()][];
        for (int i = 0; i < cluster.size(); i++) {
            matrixData[i] = listToArray(cluster.get(i));
        }
        int temporalLength = cluster.get(0).size();

        RealMatrix b = MatrixUtils.createRealMatrix(matrixData);
        RealMatrix M = b.transpose().multiply(b).subtract(MatrixUtils.createRealIdentityMatrix(temporalLength).scalarMultiply(cluster.size()));

        EigenDecomposition eig = new EigenDecomposition(M);
        RealVector newCentroid = eig.getEigenvector(0);
        double[] c = newCentroid.toArray();
        double sum = 0;
        for(double i : c) {
           sum += i;
        }
        if (sum < 0) {
            newCentroid = newCentroid.mapMultiply(-1);
        }
        double[] centroid = newCentroid.toArray();
        List<Double> newCentroidList = new ArrayList<>();
        for (int i = 0; i < temporalLength; i++) {
            newCentroidList.add(centroid[i]);
        }
        currentCenter.temporal = newCentroidList;
        centroids.set(k, currentCenter);
    }

    private void createClusters(int n) {
        List<Hashtag> arr = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            List<Double> zeros = new ArrayList<Double>(Collections.nCopies(hashtags.get(0).temporal.size(), 0d));
            Hashtag cluster = new Hashtag();
            cluster.temporal = zeros;
            arr.add(cluster);
        }
        centroids = arr;
    }

    private double sum(List<Double> arr) {
        double re = 0d;
        for (double i : arr) {
            re += i;
        }
        return re;
    }

    private Distance computeDistance(Hashtag a, Hashtag b) {
        List<Double> x = a.temporal;
        List<Double> y = b.temporal;
        double minDistance = getDistance(listToArray(x), listToArray(y));
        List<Double> optimalY = y;
        int length = x.size();
        for(int shift = -5; shift <= 5; shift++) {
            List<Double> newY = new ArrayList<>();
            if (shift < 0) {
                for(int i = -shift; i < length; i++) {
                    newY.add(y.get(i));
                }
                for(int i = 0; i < -shift; i++) {
                    newY.add(0d);
                }
            } else {
                for(int i = 0; i < shift; i++) {
                    newY.add(0d);
                }
                for(int i = 0; i < length-shift; i++) {
                    newY.add(y.get(i));
                }
            }
            double dist = getDistance(listToArray(x), listToArray(newY));
            if (minDistance > dist) {
                minDistance = dist;
                optimalY = newY;
            }
        }
        Distance distance = new Distance();
        distance.value = minDistance;
        distance.shiftedTemporal = optimalY;

        return distance;
    }

    private double getDistance(double[] x, double[] y) {
        RealVector vectorX = new ArrayRealVector(x);
        RealVector vectorY = new ArrayRealVector(y);

        double alpha = vectorX.dotProduct(vectorY) / vectorY.dotProduct(vectorY);

        return vectorX.subtract(vectorY.mapMultiply(alpha)).getNorm() / vectorX.getNorm();
    }

    private double[] listToArray(List<Double> doubles) {
        double[] target = new double[doubles.size()];
        for (int i = 0; i < target.length; i++) {
            target[i] = doubles.get(i);
        }
        return target;
    }
}
